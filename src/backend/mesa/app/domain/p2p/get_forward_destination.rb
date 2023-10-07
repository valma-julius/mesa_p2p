# frozen_string_literal: true

module P2p
  class GetForwardDestination
    include Interactor::Initializer

    initialize_with :user_id, :p2p_path_id, :peer_role

    def run
      # P2p::ValidateP2pPathPeer.for(user_id, p2p_path_id)

      send_notification_to_next_peer

      next_peer
    end

    private

    def next_peer
      @next_peer ||= P2p::NextPeer.for(p2p_path_id, peer_role)
    end

    def send_notification_to_next_peer
      P2p::NotificationToNextPeer.for(next_peer_id, user_id, p2p_path_id)
    end

    def next_peer_id
      next_peer[:next_peer_id]
    end
  end
end
