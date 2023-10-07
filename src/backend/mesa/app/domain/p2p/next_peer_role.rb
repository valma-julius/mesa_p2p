# frozen_string_literal: true

module P2p
  class NextPeerRole
    include Interactor::Initializer

    initialize_with :current_peer_name

    def run
      case current_peer_name
      when 'sender_id'
        'forwarder1'
      when 'forwarder1'
        'forwarder2'
      when 'forwarder2'
        'forwarder3'
      when 'forwarder3'
        'receiver_id'
      else
        'sender_id'
      end
    end
  end
end
