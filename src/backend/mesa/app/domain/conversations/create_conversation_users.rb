# frozen_string_literal: true

module Conversations
  class CreateConversationUsers
    def initialize(users, conversation_id)
      @users = users
      @conversation_id = conversation_id
    end

    def call
      conversation_users
    end

    private

    def conversation_users
      @users.each do | user |
        ConversationUser.create!(
          {
            conversation_id: @conversation_id,
            user_id: user,
          }
        )
      end
    end
  end
end
