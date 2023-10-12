module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user, :ip_address, :chat_id

    def connect
      self.current_user = find_verified_user
      self.ip_address = request.remote_ip
      self.chat_id = chat_id
      logger.add_tags "ActionCable", current_user.username, ip_address
    end

    private

    def find_verified_user
      if (current_user = User.find(user_id))
        current_user
      else
        reject_unauthorized_connection
      end
    end

    def user_id
      jwt_payload = JWT.decode(request.params[:jwt], ENV['DEVISE_SECRET_KEY']).first
    rescue JWT::ExpiredSignature
      reject_unauthorized_connection
    else
      jwt_payload['sub']
    end

    def chat_id
      request.params[:chat_id]
    end
  end
end
