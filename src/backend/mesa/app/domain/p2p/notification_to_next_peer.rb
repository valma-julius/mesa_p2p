# frozen_string_literal: true

module P2p
  class NotificationToNextPeer
    include Interactor::Initializer

    initialize_with :next_peer_id, :sender_id, :p2p_path_id

    def run
      send_websocket
    end

    private

    def send_websocket
      # TBA
      nil
    end
  end
end
