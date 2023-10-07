# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :user, class_name: 'User'
  belongs_to :conversation, class_name: 'Conversation'
end
