# frozen_string_literal: true

module Conversations
  class GetByUser
    def initialize(user)
      @user = user
    end

    def call
      conversations.map do |conversation|
        {
          id: conversation.id,
          name: conversation.name,
          owner_Id: conversation.user_id,
        }
      end
    end

    def conversations
      Conversation
        .joins(:conversation_user)
        .where(conversation_user: { user_id: @user.id })
    end
  end
end
