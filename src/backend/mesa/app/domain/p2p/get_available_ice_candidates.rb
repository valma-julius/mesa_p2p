# frozen_string_literal: true

module P2p
  class GetAvailableIceCandidates
    include Interactor::Initializer

    initialize_with :current_user_id, :conversation_id

    def run
      ice_candidates.map do |candidate|
        {
          ice_id: candidate.ice,
        }
      end
    end

    def ice_candidates
      UsersIceCandidate
        .where.not(user_id: conversation_users[0].id)
        .where.not(user_id: conversation_users[1].id)
        .where('updated_at >= ?',  1.minutes.ago)
        .order(id: :desc)
        .limit(100)
    end

    def conversation
      @conversation ||= Conversation.find(conversation_id)
    end

    def conversation_users
      @conversation_users ||= conversation.users
    end
  end
end




