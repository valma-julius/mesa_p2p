# frozen_string_literal: true

class P2pTransaction < ApplicationRecord
  has_many :p2p_paths
end
