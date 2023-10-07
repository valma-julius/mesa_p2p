# frozen_string_literal: true

module P2p
  class NextPeer
    include Interactor::Initializer

    initialize_with :p2p_path_id, :peer_role

    def run
      {
        next_peer_role: next_peer_role,
        next_peer_id: next_peer_id,
        next_peer_ice: next_peer_ice,
      }
    end

    private

    def p2p_path
      @p2p_path ||= P2pPath.find(p2p_path_id)
    end

    def next_peer_role
      @next_peer_role ||= P2p::NextPeerRole.for(peer_role)
    end

    def next_peer_ice
      P2p::GetPeerIce.for(next_peer_id)
    end

    def next_peer_id
      p2p_path.public_send(next_peer_role)
    end
  end
end
