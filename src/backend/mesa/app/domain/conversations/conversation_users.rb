# frozen_string_literal: true

module Conversations
  class ConversationUsers
    def initialize(conversation_id)
      @conversation_id = conversation_id
    end

    def call
      ConversationUser
        .joins(:user)
        .limit(100)
        .where(conversation_id: @conversation_id)
        .map do |conversation_user|
          {
            user_id: conversation_user.user_id,
            username: conversation_user.user.username,
          }
        end
    end
  end
end
