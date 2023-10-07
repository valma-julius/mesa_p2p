# frozen_string_literal: true

module Conversations
  class GetById

    include Interactor::Initializer

    initialize_with :user, :conversation_id

    def run
      Conversations::ValidateConversationUser.for(user.id, conversation_id)

      response
    end

    private

    def response
      {
        conversation: conversation,
        conversation_name: conversation_name,
        recipient_id: other_conversation_user_id,
        conversation_users: conversation_users,
        conversation_messages: conversation_messages,
      }
    end

    def conversation
      Conversation.find_by(id: @conversation_id)
    end

    def conversation_name
      User.find(other_conversation_user_id).username
    end

    def other_conversation_user_id
      ConversationUser
        .where(conversation_id: @conversation_id)
        .where.not(user_id: @user.id)
        .first
        .user_id
    end

    def conversation_users
      Conversations::ConversationUsers.new(@conversation_id).call
    end

    def conversation_messages
      Conversations::ConversationMessages.new(@conversation_id).call
    end
  end
end
