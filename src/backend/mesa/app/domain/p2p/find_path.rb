# frozen_string_literal: true

module P2p
  class FindPath
    include Interactor::Initializer

    initialize_with :p2p_transaction_id, :conversation_id, :sender_id, :receiver_id

    def run
    #   P2pPath.create!(
    #     p2p_transaction_id: p2p_transaction_id,
    #     conversation_id: conversation_id,
    #     sender_id: sender_id,
    #     receiver_id: receiver_id,
    #     forwarder1: forwarders[0].user_id,
    #     forwarder2: forwarders[1].user_id,
    #     forwarder3: forwarders[2].user_id,
    #   )
      P2pPath.create!(
        p2p_transaction_id: p2p_transaction_id,
        conversation_id: conversation_id,
        sender_id: sender_id,
        receiver_id: receiver_id,
        forwarder1: 12,
        forwarder2: 5,
        forwarder3: 12,
      )
    end

    private

    def forwarders
      @forwarders ||=
        UsersIceCandidate
        .where("updated_at >= ?", 5.minutes.ago)
        .limit(1000)
        .sample(3)
    end
  end
end
