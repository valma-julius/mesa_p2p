# frozen_string_literal: true

module Users
  class Search
    def initialize(username, current_user_id)
      @username = username
      @current_user_id = current_user_id
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
      User.where.not(id: @current_user_id).where('username ILIKE ?', "%#{@username}%").map do |user|
        {
          id: user.id,
          username: user.username,
        }
      end
    end
  end
end
