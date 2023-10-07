# frozen_string_literal: true

module Conversations
  class Create
    def initialize(user, params)
      @user = user
      @params = params
    end

    def call
      conversation

      Conversations::CreateConversationUsers.new(conversation_users, conversation.id).call

      response
    end

    private

    def conversation
      @conversation ||= Conversation.create!(
        {
          name: @params[:name],
          user_id: @user.id,
          identifier: @params[:identifier],
        }
      )
    end

    def conversation_users
      @params[:users]
    end

    def response
      {
        id: conversation.id,
        name: conversation.name
      }
    end
  end
end
