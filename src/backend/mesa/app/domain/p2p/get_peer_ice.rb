# frozen_string_literal: true

module P2p
  class GetPeerIce
    include Interactor::Initializer

    initialize_with :peer_id

    def run
      UsersIceCandidate.find_by(user_id: peer_id)[:ice]
    end
  end
end
