# frozen_string_literal: true

module Conversations
  class ValidateConversationUser

    include Interactor::Initializer

    initialize_with :user_id, :conversation_id

    def run
      ConversationUser.find_by!(user_id: user_id, conversation_id: conversation_id)
    rescue ActiveRecord::RecordNotFound
      raise UnauthorizedException
    end
  end
end
