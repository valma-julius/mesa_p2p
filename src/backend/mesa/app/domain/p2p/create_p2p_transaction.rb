# frozen_string_literal: true

module P2p
  class CreateP2pTransaction
    include Interactor::Initializer

    initialize_with :user_id, :conversation_id

    def run
      Conversations::ValidateConversationUser.for(user_id, conversation_id)

      response
    end

    private

    def response
      {
        p2p_transaction: transaction,
        p2p_path: p2p_path,
      }
    end

    def transaction
      @transaction ||=
        P2pTransaction.create!(
        conversation_id: conversation_id,
        author_id: user_id,
        sender_id: user_id,
        receiver_id: receiver_id,
      )
    end

    def p2p_path
      @p2p_path ||= P2p::FindPath.for(transaction.id, conversation_id, user_id, receiver_id)
    end

    def receiver_id
      Conversations::OtherConversationUser.for(user_id, conversation_id)
    end
  end
end
