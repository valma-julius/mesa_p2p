# frozen_string_literal: true

module P2P
  class ConnectToPeer
    def initialize(p2p_chat_id, current_user)
      @p2p_chat_id = p2p_chat_id
      @current_user = current_user
    end

    def call
      ActionCable.server.broadcast "p2p_chat_#{p2p_chat_id}", {
        type: 'offer_to_connect',
        message: 'May we connect',
        conversation_id: @p2p_chat_id,
        author_id: @current_user.id,
      }
    end
  end
end
