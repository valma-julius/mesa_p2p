# frozen_string_literal: true

module P2p
  class ValidateP2pPathOwner
    include Interactor::Initializer

    initialize_with :user_id, :p2p_path_id

    def run
      return if p2p_path.sender_id == user_id
      # return if p2p_path.receiver_id == user_id

      raise UnauthorizedException
    end

    private

    def p2p_path
      @p2p_path ||= P2pPath.find(p2p_path_id)
    end
  end
end
