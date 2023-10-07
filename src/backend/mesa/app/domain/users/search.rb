# frozen_string_literal: true

module Users
  class Search
    def initialize(username)
      @username = username
    end

    def call
      response
    end

    private

    def response
      {
        users: users
      }
    end

    def users
      User.where('username ILIKE ?', "%#{@username}%").map do |user|
        {
          id: user.id,
          username: user.username,
        }
      end
    end
  end
end
