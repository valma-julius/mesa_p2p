# frozen_string_literal: true

module P2pPathEnums
  extend ActiveSupport::Concern

  included do
    enum last_peer: {
      sender_id: 'sender_id',
      forwarder1: 'forwarder1',
      forwarder2: 'forwarder2',
      forwarder3: 'forwarder3',
      receiver_id: 'receiver_id',
    }.freeze, _prefix: true
  end
end
