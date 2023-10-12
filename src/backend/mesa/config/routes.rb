Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  devise_for :users,
             controllers: {
               sessions: 'users/session',
               registrations: 'users/registration'
             },
             defaults: { format: :json }
  get '/member-data', to: 'members#show'

  # Conversations routes
  resources :conversations, only: [:index, :create] do
    member do
      post :new_message
      post :send_ip_address
      get :get_conversation
      patch :edit_message
    end
  end

  post '/create_ice_candidate', to: 'p2p#create_ice_candidate'
  post '/create_p2p_path', to: 'p2p#create_p2p_path'
  post '/create_p2p_transaction', to: 'p2p#create_p2p_transaction'
  post '/complete_p2p_transaction', to: 'p2p#complete_p2p_transaction'
  post '/p2p_paths/:id/request_send_p2p_message', to: 'p2p#request_send_p2p_message'
  get '/p2p_paths/:id', to: 'p2p#show'
  get '/p2p_paths/:id/get_forward_destination', to: 'p2p#get_forward_destination'
  get '/p2p_paths/:id/next_peer', to: 'p2p#next_peer'
  get '/get_pending_transactions', to: 'p2p#get_pending_author_transactions'

  # Users routes
  get 'users/search', to: 'users#search'
end