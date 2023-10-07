class Users::RegistrationController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    register_success && return if resource.persisted?

    register_failed
  end

  def register_success
    render json: {
      message: 'Signed up ok',
      user: current_user,
    }, status: :ok
  end

  def register_failed
    render json: { message: 'Username is already used' }, status: :unprocessable_entity
  end
end
