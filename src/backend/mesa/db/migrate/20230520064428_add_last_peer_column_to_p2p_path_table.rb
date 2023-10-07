# frozen_string_literal: true

class AddLastPeerColumnToP2pPathTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "p2p_paths"
      ADD COLUMN "last_peer" VARCHAR(255) NULL;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_paths"
      DROP COLUMN "last_peer";
    SQL
  end
end
