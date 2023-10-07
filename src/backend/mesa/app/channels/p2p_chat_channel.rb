class P2pChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "p2p_chat_#{p2p_chat_id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    case data['command']
    when 'connect_to_peer'
      connect_to_peer
    when 'offer_accepted'
      connected_to_peer
    when 'candidate'
      candidate_ice(data)
    when 'peer_id_offer'
      peer_id_offer(data)
    end
  end

  def connect_to_peer
    ActionCable.server.broadcast "p2p_chat_#{p2p_chat_id}", {
      type: 'offer_to_connect',
      message: 'May we connect',
      conversation_id: p2p_chat_id,
      author_id: current_user.id,
    }
  end

  def connected_to_peer
    ActionCable.server.broadcast "p2p_chat_#{p2p_chat_id}", {
      type: 'offer_accepted',
      message: 'We may',
      conversation_id: p2p_chat_id,
      author_id: current_user.id,
    }
  end

  def candidate_ice(data)
    pp data
  end

  def peer_id_offer(data)
    pp data["message"]
    ActionCable.server.broadcast "p2p_chat_#{p2p_chat_id}", {
      type: 'peer_id_from_another_user',
      message: data['message'],
      conversation_id: p2p_chat_id,
      author_id: current_user.id,
    }
  end

  def p2p_chat_id
    params[:conversation_id]
  end

  def p2p_chat_recipient_id
    ConversationUser
      .where(conversation_id: p2p_chat_id)
      .where.not(user_id: current_user.id)
      &.user_id
  end
end
