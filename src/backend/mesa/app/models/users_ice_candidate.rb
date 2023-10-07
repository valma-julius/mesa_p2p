# frozen_string_literal: true

class UsersIceCandidate < ApplicationRecord
  belongs_to :user, class_name: 'User'
end
