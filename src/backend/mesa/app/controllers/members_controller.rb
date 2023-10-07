class MembersController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: {
      message: "if u see this",
      user: user,
    }
  end

  private

  def user
    @user ||= User.find(user_id)
  end

  def user_id
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], Rails.application.credentials[:devise_jwt_secret]).first

    jwt_payload['sub']
  end
end
