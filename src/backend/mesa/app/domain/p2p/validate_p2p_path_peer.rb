# frozen_string_literal: true

module P2p
  class ValidateP2pPathPeer
    include Interactor::Initializer

    initialize_with :user_id, :p2p_path_id

    def run
      return if user_id == p2p_path.sender_id
      return if user_id == p2p_path.forwarder1
      return if user_id == p2p_path.forwarder2
      return if user_id == p2p_path.forwarder3
      return if user_id == p2p_path.receiver_id

      raise UnauthorizedException
    end

    private

    def p2p_path
      @p2p_path ||= P2pPath.find(p2p_path_id)
    end
  end
end
