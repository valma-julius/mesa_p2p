# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def search
    response = Users::Search.new(username).call
    render json: response, status: :ok
  end

  private

  def username
    params[:username]
  end
end
