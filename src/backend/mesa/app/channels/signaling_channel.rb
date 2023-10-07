class SignalingChannel < ApplicationCable::Channel
  def subscribed
    stream_from "signaling_channel_#{current_user.id}"
  end

  def send_connection_request(data)
    recipient = User.find(data['recipient'])
    ActionCable.server.broadcast "signaling_channel_#{recipient.id}", {
      type: 'connection_request',
      sender: current_user.id,
      ip_address: ip_address
    }
  end

  def send_ip_address(data)
    recipient = User.find(data['recipient'])
    ActionCable.server.broadcast "signaling_channel_#{recipient.id}", {
      type: 'ip_address',
      ip_address: data['ip_address'], # Use the IP address from the data object
      sender: current_user.id
    }
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
