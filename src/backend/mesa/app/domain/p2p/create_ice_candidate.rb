# frozen_string_literal: true

module P2p
  class CreateIceCandidate
    include Interactor::Initializer

    initialize_with :user_id, :ice

    def run
      users_ice_candidate.update!(ice: ice, updated_at: Time.now) if users_ice_candidate

      UsersIceCandidate.create!(user_id: user_id, ice: ice) unless users_ice_candidate

      users_ice_candidate
    end

    def users_ice_candidate
      UsersIceCandidate.find_by(user_id: user_id)
    end
  end
end
