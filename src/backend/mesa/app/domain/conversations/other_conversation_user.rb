# frozen_string_literal: true

module Conversations
  class OtherConversationUser

    include Interactor::Initializer

    initialize_with :user_id, :conversation_id

    def run
      ConversationUser
        .where(conversation_id: conversation_id)
        .where.not(user_id: user_id)
        .first
        .user_id
    end
  end
end
