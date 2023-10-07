# frozen_string_literal: true

class DropP2pPathIdColumnFromP2pTransaction < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "p2p_path_id";
    SQL

    execute <<-SQL
      ALTER TABLE "p2p_paths" ADD COLUMN "p2p_transaction_id" INTEGER NULL;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "p2p_transactions" DROP COLUMN "p2p_transaction_id";
    SQL
  end
end
