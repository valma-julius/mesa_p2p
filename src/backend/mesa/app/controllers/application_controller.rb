class ApplicationController < ActionController::API
  respond_to :json
  include ActionController::MimeResponds

  rescue_from UnauthorizedException do |exception|
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
