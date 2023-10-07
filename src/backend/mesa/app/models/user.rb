# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist,
         authentication_keys: [:username]

  validates :username, presence: true, uniqueness: { case_sensitive: false }

  has_many :conversation_users
  has_many :conversations, through: :conversation_users
  has_many :users_ice_candidates
end
