# frozen_string_literal: true

class ConversationsController < ApplicationController
  before_action :authenticate_user!

  def index
    conversations = current_user.conversations.order(created_at: :desc).map do |conversation|
      {
        id: conversation.id,
        name: conversation.name,
        conversation_name: conversation_name(conversation.id) || conversation.name,
        identifier: conversation.identifier,
        created_at: conversation.created_at,
        user_id: conversation.user_id,
      }
    end
    # conversations = current_user.conversations
    render json: { conversations: conversations }, status: :ok
  end

  def create
    conversation = Conversations::Create.new(current_user, conversation_params).call
    render json: { conversation: conversation }, status: :created
  end

  def get_conversation
    render json: Conversations::GetById.for(current_user,  params[:id])
  end
  def new_message
    message = Conversations::NewMessage.for(current_user, message_params)

    ActionCable.server.broadcast "signaling_channel_#{other_conversation_user_id(message.conversation_id)}", { sender: current_user.username }

    render json: { message: message }, status: :created
  end

  def edit_message
    response = Conversations::EditMessage.for(params[:message_id], params[:message_content], current_user.id)

    ActionCable.server.broadcast "signaling_channel_#{other_conversation_user_id(conversation_id)}", { sender: current_user.username }

    render json: response
  end

  def send_ip_address
    ActionCable.server.broadcast "signaling_channel_#{other_conversation_user_id(params[:ip_address][:conversation_id])}", { sender_ip_address: params[:ip_address][:ip_address] }

    head :ok
  end

  private

  def conversation_params
    params.require(:conversation)
  end

  def message_params
    params.require(:message).permit(:text, :conversation_id)
  end

  def ip_address_params
    params.require(:ip_address).permit(:conversation_id, :ip_address)
  end

  def conversation_id
    params[:id]
  end

  def conversation_name(conversation_id)
    User
      .find_by(id: other_conversation_user_id(conversation_id))
      &.username
  end

  def other_conversation_user_id(conversation_id)
    ConversationUser
      .where(conversation_id: conversation_id)
      .where.not(user_id: current_user.id)
      .first
      &.user_id
  end
end
