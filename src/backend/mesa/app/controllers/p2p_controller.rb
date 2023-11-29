# frozen_string_literal: true

class P2pController < ApplicationController
  before_action :authenticate_user!

  def show
    P2p::ValidateP2pPathOwner.for(user_id, p2p_path_id)

    render json: P2pPath.find(p2p_path_id)
  end

  def p2p_message
    head :ok
  end

  def next_peer

  end

  def create_ice_candidate
    render json: P2p::CreateIceCandidate.for(user_id, ice)
  end

  def remove_ice_candidate
    P2p::RemoveIceCandidate.for(user_id)

    head :ok
  end

  def get_available_ice_candidates
    render json: P2p::GetAvailableIceCandidates.for(user_id, params[:conversation_id])
  end

  def create_p2p_path
    render json: P2p::FindPath.for(user_id, receiver_id, conversation_id)
  end

  def create_p2p_transaction
    render json: P2p::CreateP2pTransaction.for(user_id, conversation_id)
  end

  def complete_p2p_transaction
    P2p::CompleteP2pTransaction.for(user_id, transaction_id)

    head :ok
  end

  def get_forward_destination
    render json: P2p::GetForwardDestination.for(user_id, p2p_path_id, peer_role)
  end

  def get_pending_author_transactions
    render json: P2p::GetPendingTransactions.for(user_id)
  end

  def request_send_p2p_message
    render json: P2p::SendP2pMessage.for(p2p_path_id, user_id, peer_role)
  end

  private

  def user_id
    current_user.id
  end

  def receiver_id
    params[:p2p][:receiver_id]
  end

  def transaction_id
    params[:p2p][:transaction_id]
  end

  def conversation_id
    params[:p2p][:conversation_id]
  end

  def peer_role
    params[:p2p][:peer_role]
  end

  def ice
    params[:p2p][:ice]
  end

  def p2p_path_id
    params[:id]
  end
end
