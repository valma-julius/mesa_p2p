# frozen_string_literal: true

module P2p
  class ValidateP2pTransactionOwner
    include Interactor::Initializer

    initialize_with :user_id, :transaction_id

    def run
      return if transaction.sender_id == user_id
      return if transaction.receiver_id == user_id

      raise UnauthorizedException
    end

    private

    def transaction
      @transaction ||= P2pTransaction.find(transaction_id)
    end
  end
end
