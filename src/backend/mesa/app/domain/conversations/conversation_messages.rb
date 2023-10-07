# frozen_string_literal: true

module Conversations
  class ConversationMessages
    def initialize(conversation_id)
      @conversation_id = conversation_id
    end

    def call
      Message.limit(100).where(conversation_id: @conversation_id).joins(:user).order(created_at: :asc).map do |message|
        {
          id: message.id,
          user_id: message.user_id,
          author: message.user.username,
          text: message.text,
          created_at: message.created_at,
        }
      end
    end
  end
end
