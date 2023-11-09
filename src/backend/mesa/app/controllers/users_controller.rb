# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def search
    response = Users::Search.new(username, user_id).call
    render json: response, status: :ok
  end

  private

  def user_id
    current_user.id
  end

  def username
    params[:username]
  end
end
