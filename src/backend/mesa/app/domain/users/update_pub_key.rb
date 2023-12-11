# frozen_string_literal: true

module Users
  class UpdatePubKey
    include Interactor::Initializer

    initialize_with :user, :pub_key

    def run
      user.update!(pub_key: pub_key)
    end
  end
end
