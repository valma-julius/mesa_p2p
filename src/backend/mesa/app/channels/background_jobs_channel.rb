class BackgroundJobsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "background_jobs_channel_#{current_user.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
