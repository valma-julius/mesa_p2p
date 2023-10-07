# frozen_string_literal: true

module P2p
  class GetPendingTransactions
    include Interactor::Initializer

    initialize_with :user_id

    def run
      P2pTransaction.where(author_id: user_id, completed: false)
    end
  end
end
