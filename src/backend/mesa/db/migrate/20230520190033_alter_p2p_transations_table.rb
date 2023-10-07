# frozen_string_literal: true

class AlterP2pTransationsTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "p2p_transactions" ADD COLUMN "completed" BOOLEAN DEFAULT FALSE;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "p2p_transactions";
    SQL
  end
end

