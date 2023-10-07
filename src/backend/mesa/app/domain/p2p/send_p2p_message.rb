# frozen_string_literal: true

module P2p
  class SendP2pMessage
    include Interactor::Initializer

    initialize_with :p2p_path_id, :sender_id, :sender_role

    def run
      P2p::ValidateP2pPathPeer.for(sender_id, p2p_path_id)

      send_expect_peer

      response
    end

    private

    def response
      {
        receiver_ice: next_peer[:next_peer_ice]
      }
    end

    def send_expect_peer
      P2p::BackgroundJobs::SendExpectPeer.for(
        sender_id,
        next_peer[:next_peer_id],
        next_peer[:next_peer_role],
        p2p_path_id
      )
    end

    def p2p_path
      P2pPath.find(p2p_path_id)
    end

    def next_peer
      @next_peer ||= P2p::NextPeer.for(p2p_path_id, sender_role)
    end
  end
end
