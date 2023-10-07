# frozen_string_literal: true

module P2p::BackgroundJobs
    class SendExpectPeer
      include Interactor::Initializer

      initialize_with :sender_id, :receiver_id, :receiver_role, :p2p_path_id

      def run
        ActionCable.server.broadcast(channel_name, message)
      end

      private

      def channel_name
        "background_jobs_channel_#{receiver_id}"
      end

      def message
        {
          event: 'expect_transaction',
          p2p_path_id: p2p_path_id,
          sender_ice: sender_ice,
          role: receiver_role,
        }
      end

      def sender_ice
        UsersIceCandidate.find_by(user_id: sender_id)[:ice]
      end
    end
end
