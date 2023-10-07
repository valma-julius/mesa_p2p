# frozen_string_literal: true

class Conversation < ApplicationRecord
  has_many :conversation_users
  has_many :users, through: :conversation_users
end
