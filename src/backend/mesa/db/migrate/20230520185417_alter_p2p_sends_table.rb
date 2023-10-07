# frozen_string_literal: true

class AlterP2pSendsTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      DROP INDEX "index_message_p2p_sends_on_message_id";
    SQL

    execute <<-SQL
      ALTER TABLE "message_p2p_sends" RENAME TO "p2p_transactions";
    SQL

    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "message_id";
    SQL

    execute <<-SQL
      ALTER TABLE "p2p_transactions" ADD COLUMN "p2p_path_id" INTEGER NOT NULL;
    SQL

    execute <<-SQL
      CREATE INDEX "index_message_p2p_sends_on_p2p_path_id" ON "p2p_transactions" ("p2p_path_id");
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "p2p_path_id" ;
    SQL

    execute <<-SQL
      DROP INDEX "index_message_p2p_sends_on_p2p_path_id";
    SQL
  end
end

