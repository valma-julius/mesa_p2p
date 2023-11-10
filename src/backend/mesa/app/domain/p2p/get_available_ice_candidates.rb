# frozen_string_literal: true

module P2p
  class GetAvailableIceCandidates
    include Interactor::Initializer

    initialize_with :current_user_id

    def run
      ice_candidates.map do |candidate|
        {
          ice_id: candidate.ice,
        }
      end
    end

    def ice_candidates
      UsersIceCandidate.where.not(user_id: current_user_id).where('updated_at >= ?',  2.minutes.ago).order(id: :desc).limit(100)
    end
  end
end




