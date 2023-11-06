# frozen_string_literal: true

module P2p
  class RemoveIceCandidate
    include Interactor::Initializer

    initialize_with :user_id

    def run
      UsersIceCandidate.find_by(user_id: user_id).destroy!
    end
  end
end
