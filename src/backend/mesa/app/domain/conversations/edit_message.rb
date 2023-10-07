# frozen_string_literal: true

module Conversations
  class EditMessage

    include Interactor::Initializer

    initialize_with :message_id, :message_content, :user_id

    def run
      validate_message_owner

      message.update!(text: message_content)

      message
    end

    private

    def validate_message_owner
      return if message.user_id == user_id

      raise UnauthorizedException
    end

    def message
      @message ||= Message.find(message_id)
    end
  end
end
