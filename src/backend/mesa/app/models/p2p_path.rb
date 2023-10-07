# frozen_string_literal: true

class P2pPath < ApplicationRecord
  include P2pPathEnums

  belongs_to :conversation, class_name: 'Conversation'
end
