# frozen_string_literal: true

module Conversations
  class NewMessage
    include Interactor::Initializer

    initialize_with :user, :message_params

    def run
      Conversations::ValidateConversationUser.for(user.id, conversation_id)

      Message.create!(
        {
          user_id: user.id,
          conversation_id: conversation_id,
          text: text,
        }
      )
    end

    private

    def text
      message_params[:text]
    end

    def conversation_id
      message_params[:conversation_id]
    end
  end
end
