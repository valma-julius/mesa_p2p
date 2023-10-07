# frozen_string_literal: true

module P2p
  class CompleteP2pTransaction
    include Interactor::Initializer

    initialize_with :user_id, :transaction_id

    def run
      P2p::ValidateP2pTransactionOwner.for(user_id, transaction_id)

      update_transaction

      transaction
    end

    private

    def update_transaction
      transaction.update!(completed: true)
    end

    def transaction
      P2pTransaction.find(transaction_id)
    end
  end
end
